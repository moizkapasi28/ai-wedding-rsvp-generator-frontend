import { generalService } from "@/api/general.service";
import Page, { PageHeader } from "@/components/Page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { useAuth, useUpdateProfile } from "@/hooks/use-auth";
import { useGetViewUrl } from "@/hooks/use-pageSetting";
import { cn } from "@/lib/utils";
import { getCroppedImg } from "@/utilities/cropImage";
import {
  updateProfileSchema,
  type UpdateProfileRequest,
} from "@/validations/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Crop, Loader2, Pencil, ShieldAlert, Trash2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Avtar from "react-avatar";
import Cropper, { type Area } from "react-easy-crop";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

// Sized against the content width, not the viewport, like the other pages
const SHELL = "@container/profile";
const FIELD_GRID = "grid gap-5 @min-[34rem]/profile:grid-cols-2 @min-[52rem]/profile:grid-cols-3";

const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
};

export default function ViewProfile() {
  const { user } = useAuth();
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Crop state
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

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

  // Stored profile pictures are S3 object keys; older ones may be full URLs
  const picture = user?.profile_picture ?? null;
  const isObjectKey =
    !!picture && !picture.startsWith("http") && !picture.startsWith("data:");
  const { data: pictureViewUrl } = useGetViewUrl(isObjectKey ? picture : null);
  const actualImageUrl =
    previewImage ?? (isObjectKey ? pictureViewUrl : picture) ?? "";

  // Declared before the early return below: hooks must run on every render
  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );

  if (!user) {
    return (
      <Page>
        <PageHeader title="Profile" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </Page>
    );
  }

  const userName = `${user.first_name} ${user.last_name}`.trim();

  const onSubmit = (data: UpdateProfileRequest) => {
    updateProfile(data, {
      onSuccess: () => {
        setIsEditing(false);
      },
    });
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setImageToCrop(objectUrl);
    setCropDialogOpen(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCropConfirm = async () => {
    if (!imageToCrop || !croppedAreaPixels || !user) return;

    try {
      setIsUploading(true);
      setCropDialogOpen(false);

      const croppedFile = await getCroppedImg(imageToCrop, croppedAreaPixels);
      if (!croppedFile) throw new Error("Failed to crop image");

      const objectUrl = URL.createObjectURL(croppedFile);
      setPreviewImage(objectUrl);

      const ext = "jpg";
      const objectKey = `users/${user.id}/profile_${Date.now()}.${ext}`;

      const {
        data: { url, object_key },
      } = await generalService.generateUploadUrl(objectKey, croppedFile.type);

      await generalService.uploadFileToS3(url, croppedFile);

      updateProfile(
        {
          firstName: user.first_name,
          lastName: user.last_name,
          mobileNumber: user.mobile_number,
          profilePicture: object_key,
        },
        {
          onError: () => {
            setPreviewImage(null);
          },
        },
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image",
      );
      setPreviewImage(null);
    } finally {
      setIsUploading(false);
      setImageToCrop(null);
      setZoom(1);
    }
  };

  const handleRemoveImage = () => {
    if (!user) return;

    updateProfile(
      {
        firstName: user.first_name,
        lastName: user.last_name,
        mobileNumber: user.mobile_number,
        profilePicture: null,
      },
      {
        onSuccess: () => {
          setPreviewImage(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        },
      },
    );
  };

  return (
    <Page>
      <PageHeader title="My Profile" />

      <div className={SHELL}>
        {/* One hairline panel: identity across the top, the fields below it.
            The gradient header slab is gone — the app bar already names the
            page, and Edit belongs next to what it edits. */}
        <Card className="p-5">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-4">
            <div className="group relative shrink-0">
              <Avtar
                name={userName}
                size="72px"
                round
                src={actualImageUrl}
                className="border border-border"
              />
              <button
                type="button"
                onClick={() => !isUploading && fileInputRef.current?.click()}
                aria-label="Change profile picture"
                className={cn(
                  "absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100",
                  isUploading && "opacity-100",
                )}
              >
                {isUploading ? (
                  <Loader2 className="size-5 animate-spin text-white" />
                ) : (
                  <Camera className="size-5 text-white" />
                )}
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageSelect}
              />
              {actualImageUrl && !isUploading && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  onClick={handleRemoveImage}
                  disabled={isPending}
                  aria-label="Remove profile picture"
                  title="Remove profile picture"
                  className="absolute -right-1 -bottom-1 rounded-full text-destructive opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
                >
                  <Trash2 />
                </Button>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="truncate font-display text-2xl leading-none font-medium tracking-[-0.03em]">
                {userName || "Your account"}
              </h2>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="truncate text-sm text-muted-foreground">
                  {user.email}
                </span>
                {user.is_email_verified ? (
                  <Badge className="rounded-md border border-green-500/30 bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
                    Verified
                  </Badge>
                ) : (
                  <Badge className="gap-1 rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400">
                    <ShieldAlert className="size-3" />
                    Unverified
                  </Badge>
                )}
              </div>
            </div>

            {!isEditing && (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Pencil />
                Edit profile
              </Button>
            )}
          </div>

          <div className="mt-5 border-t border-border pt-5">
            {isEditing ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className={FIELD_GRID}>
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>First name</FormLabel>
                          <FormControl>
                            <Input placeholder="First name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Last name</FormLabel>
                          <FormControl>
                            <Input placeholder="Last name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="mobileNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Mobile number</FormLabel>
                          <FormControl>
                            <Input placeholder="+1234567890" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* The three read-only facts stay on the page while editing,
                      so the panel doesn't reflow to a different height */}
                  <dl className={cn(FIELD_GRID, "mt-5")}>
                    <ReadOnlyFacts user={user} />
                  </dl>

                  <div className="mt-5 flex flex-wrap justify-end gap-3 border-t border-border pt-5">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        form.reset();
                        setIsEditing(false);
                      }}
                      disabled={isPending}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" loading={isPending}>
                      Save changes
                    </Button>
                  </div>
                </form>
              </Form>
            ) : (
              <dl className={FIELD_GRID}>
                <Fact label="First name">{user.first_name || <Empty />}</Fact>
                <Fact label="Last name">{user.last_name || <Empty />}</Fact>
                <Fact label="Mobile number">
                  {user.mobile_number || <Empty />}
                </Fact>
                <ReadOnlyFacts user={user} />
              </dl>
            )}
          </div>
        </Card>
      </div>

      {/* Cropper Dialog */}
      <Dialog open={cropDialogOpen} onOpenChange={setCropDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Crop profile picture</DialogTitle>
            <DialogDescription>
              Drag to reposition, then pick how close in you want it.
            </DialogDescription>
          </DialogHeader>

          <div className="relative h-[300px] w-full overflow-hidden rounded-lg border border-border bg-muted/50">
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

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Zoom</span>
            <Slider
              value={[zoom]}
              min={1}
              max={3}
              step={0.1}
              onValueChange={(val) => setZoom(val[0])}
              className="flex-1"
              aria-label="Zoom"
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCropDialogOpen(false);
                setImageToCrop(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCropConfirm} loading={isUploading}>
              <Crop />
              Save &amp; upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Page>
  );
}

/** Email and the two timestamps: the same three cells in both modes. */
function ReadOnlyFacts({
  user,
}: {
  user: { email: string; created_at?: string; updated_at?: string };
}) {
  return (
    <>
      <Fact label="Email address">{user.email}</Fact>
      <Fact label="Member since">
        {user.created_at ? formatDate(user.created_at) : <Empty />}
      </Fact>
      <Fact label="Last updated">
        {user.updated_at ? formatDate(user.updated_at) : <Empty />}
      </Fact>
    </>
  );
}

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 truncate text-sm">{children}</dd>
    </div>
  );
}

const Empty = () => <span className="text-muted-foreground">—</span>;
