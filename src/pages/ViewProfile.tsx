import { useState, useEffect, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth, useUpdateProfile } from "@/hooks/use-auth";
import { generalService } from "@/api/general.service";
import Avtar from "react-avatar";
import Cropper from "react-easy-crop";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { User, Loader2, Save, X, Edit2, ShieldAlert, Camera, Trash2, Crop } from "lucide-react";
import Page, { PageHeader } from "@/components/Page";
import { updateProfileSchema, type UpdateProfileRequest } from "@/validations/auth.validation";
import { getCroppedImg } from "@/utilities/cropImage";
import toast from "react-hot-toast";

export default function ViewProfile() {
  const { user } = useAuth();
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [actualImageUrl, setActualImageUrl] = useState<string>("");
  
  // Crop state
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  
  const form = useForm<UpdateProfileRequest>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      mobileNumber: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        mobileNumber: user.mobile_number || "",
      });
    }
  }, [user, form]);

  useEffect(() => {
    if (previewImage) {
      setActualImageUrl(previewImage);
    } else if (user?.profile_picture) {
      if (user.profile_picture.startsWith('http') || user.profile_picture.startsWith('data:')) {
        setActualImageUrl(user.profile_picture);
      } else {
        generalService.generateViewUrl(user.profile_picture)
          .then(res => setActualImageUrl(res.data.url))
          .catch(() => setActualImageUrl(""));
      }
    } else {
      setActualImageUrl("");
    }
  }, [user?.profile_picture, previewImage]);

  if (!user) {
    return (
      <Page>
        <PageHeader title="Profile" />
        <div className="flex h-[50vh] items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Page>
    );
  }

  const userName = `${user.first_name} ${user.last_name}`;

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  const onSubmit = (data: UpdateProfileRequest) => {
    updateProfile(data, {
      onSuccess: () => {
        setIsEditing(false);
      }
    });
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setImageToCrop(objectUrl);
    setCropDialogOpen(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropConfirm = async () => {
    if (!imageToCrop || !croppedAreaPixels || !user) return;
    
    try {
      setIsUploading(true);
      setCropDialogOpen(false);
      
      const croppedFile = await getCroppedImg(imageToCrop, croppedAreaPixels);
      if (!croppedFile) throw new Error("Failed to crop image");
      
      const objectUrl = URL.createObjectURL(croppedFile);
      setPreviewImage(objectUrl);
      
      const ext = 'jpg';
      const objectKey = `users/${user.id}/profile_${Date.now()}.${ext}`;
      
      const { data: { url, object_key } } = await generalService.generateUploadUrl(objectKey, croppedFile.type);
      
      await generalService.uploadFileToS3(url, croppedFile);
      
      updateProfile({
        firstName: user.first_name,
        lastName: user.last_name,
        mobileNumber: user.mobile_number,
        profilePicture: object_key
      }, {
        onError: () => {
          setPreviewImage(null);
        }
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to upload image");
      setPreviewImage(null);
    } finally {
      setIsUploading(false);
      setImageToCrop(null);
      setZoom(1);
    }
  };

  const handleRemoveImage = () => {
    if (!user) return;
    
    updateProfile({
      firstName: user.first_name,
      lastName: user.last_name,
      mobileNumber: user.mobile_number,
      profilePicture: null
    }, {
      onSuccess: () => {
        setPreviewImage(null);
        setActualImageUrl("");
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    });
  };

  return (
    <Page>
      <PageHeader title="My Profile" />

      <Card className="shadow-sm mb-5 overflow-hidden py-0 gap-0">
        <CardHeader className="bg-linear-to-r from-orange-500 to-pink-600 p-5 text-white flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-white m-0">
            <User className="h-5 w-5 opacity-90" />
            Profile Details
          </CardTitle>
          {!isEditing && (
            <Button 
              size="sm" 
              variant="secondary" 
              className="gap-2 bg-white/20 hover:bg-white/30 text-white border-0"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="w-4 h-4" /> Edit Profile
            </Button>
          )}
        </CardHeader>
        
        <CardContent className="space-y-6 p-6 pt-6">
          <div className="flex flex-col md:flex-row items-center gap-6 mb-2">
            <div className="relative group">
              <Avtar
                name={userName}
                size="80px"
                round={true}
                src={actualImageUrl}
                className="shadow-sm border-2 border-background"
              />
              <div 
                onClick={() => !isUploading && fileInputRef.current?.click()}
                className={`absolute inset-0 bg-black/40 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity ${isUploading ? 'opacity-100' : ''}`}
              >
                {isUploading ? (
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                ) : (
                  <Camera className="w-6 h-6 text-white" />
                )}
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleImageSelect}
              />
              {actualImageUrl && !isUploading && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage();
                  }}
                  className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-1.5 shadow-md hover:bg-destructive/90 transition-colors z-10 opacity-0 group-hover:opacity-100"
                  title="Remove Profile Picture"
                  disabled={isPending}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">{userName}</h2>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-muted-foreground text-sm">{user.email}</p>
                {user.is_email_verified ? (
                  <Badge variant="default" className="text-[10px] px-2 py-0 h-5 bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-900/50">
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="text-[10px] px-2 py-0 h-5 gap-1">
                    <ShieldAlert className="w-3 h-3" /> Unverified
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <Separator />
          
          {isEditing ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  <div className="min-w-0">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold mb-1">
                            First Name
                          </p>
                          <FormControl>
                            <Input placeholder="First Name" {...field} className="h-9" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="min-w-0">
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold mb-1">
                            Last Name
                          </p>
                          <FormControl>
                            <Input placeholder="Last Name" {...field} className="h-9" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="min-w-0">
                    <FormField
                      control={form.control}
                      name="mobileNumber"
                      render={({ field }) => (
                        <FormItem>
                          <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold mb-1">
                            Mobile Number
                          </p>
                          <FormControl>
                            <Input placeholder="+1234567890" {...field} className="h-9" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold mb-1">
                      Email Address
                    </p>
                    <p className="font-medium text-base truncate h-9 flex items-center">
                      {user.email}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold mb-1">
                      Member Since
                    </p>
                    <p className="font-medium text-base truncate h-9 flex items-center">
                      {user.created_at ? formatDate(user.created_at) : "-"}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold mb-1">
                      Last Updated
                    </p>
                    <p className="font-medium text-base truncate h-9 flex items-center">
                      {user.updated_at ? formatDate(user.updated_at) : "-"}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 mt-6 border-t">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      form.reset();
                      setIsEditing(false);
                    }}
                    disabled={isPending}
                  >
                    <X className="w-4 h-4 mr-2" /> Cancel
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Changes
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <div className="min-w-0">
                <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold mb-1">
                  First Name
                </p>
                <p className="font-medium text-base truncate h-9 flex items-center">
                  {user.first_name || "-"}
                </p>
              </div>
              
              <div className="min-w-0">
                <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold mb-1">
                  Last Name
                </p>
                <p className="font-medium text-base truncate h-9 flex items-center">
                  {user.last_name || "-"}
                </p>
              </div>
              
              <div className="min-w-0">
                <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold mb-1">
                  Mobile Number
                </p>
                <p className="font-medium text-base truncate h-9 flex items-center">
                  {user.mobile_number || "-"}
                </p>
              </div>
              
              <div className="min-w-0">
                <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold mb-1">
                  Email Address
                </p>
                <p className="font-medium text-base truncate h-9 flex items-center">
                  {user.email}
                </p>
              </div>

              <div className="min-w-0">
                <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold mb-1">
                  Member Since
                </p>
                <p className="font-medium text-base truncate h-9 flex items-center">
                  {user.created_at ? formatDate(user.created_at) : "-"}
                </p>
              </div>
              
              <div className="min-w-0">
                <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold mb-1">
                  Last Updated
                </p>
                <p className="font-medium text-base truncate h-9 flex items-center">
                  {user.updated_at ? formatDate(user.updated_at) : "-"}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Cropper Dialog */}
      <Dialog open={cropDialogOpen} onOpenChange={setCropDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Crop Profile Picture</DialogTitle>
            <DialogDescription>
              Adjust the image to fit the avatar perfectly.
            </DialogDescription>
          </DialogHeader>
          
          <div className="relative w-full h-[300px] bg-muted/50 rounded-lg overflow-hidden border">
            {imageToCrop && (
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                cropShape="round"
                showGrid={false}
              />
            )}
          </div>
          
          <div className="space-y-4 my-2">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Zoom</span>
              <Slider
                value={[zoom]}
                min={1}
                max={3}
                step={0.1}
                onValueChange={(val) => setZoom(val[0])}
                className="flex-1"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setCropDialogOpen(false);
              setImageToCrop(null);
            }}>
              Cancel
            </Button>
            <Button onClick={handleCropConfirm} disabled={isUploading} className="gap-2">
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Crop className="w-4 h-4" />}
              Save & Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Page>
  );
}
