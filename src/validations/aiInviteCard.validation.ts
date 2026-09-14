import * as z from "zod";

export const aiInviteFormSchema = z.object({
    activeTab: z.enum(["describe", "upload"]),
    designPreset: z.string().optional(),
    textureEmulation: z.string().optional(),
    typographyPairing: z.string().optional(),
    metallicAccents: z.string().optional(),
    negativeSpace: z.string().optional(),
    monogramStyle: z.string().optional(),
    textAlignment: z.string().optional(),
    edgeStyling: z.string().optional(),
    additionalDetails: z.string().optional(),
    customMessage: z.string().optional(),
    referenceKey: z.string().nullable().optional(),
    characterKey: z.string().nullable().optional(),
    photoType: z.enum(["couple", "bride", "groom"]),
    photoPlacement: z.enum(["SWAP_IN_PLACE", "FRAMED_INSET"]).nullable().optional(),
    illustrationStyle: z.string().nullable().optional(),
    brideAttireStyle: z.string().optional(),
    groomAttireStyle: z.string().optional(),
    singleAttireStyle: z.string().optional(),
}).superRefine((data, ctx) => {
    if (data.activeTab === "upload") {
        if (!data.referenceKey) {
            ctx.addIssue({
                code: "custom",
                message: "Reference image is required when in upload mode.",
                path: ["referenceKey"],
            });
        }
    }
    if (data.activeTab === "describe") {
        // Generation in manual mode needs every design choice, so flag them here
        // instead of letting the API reject the request.
        const requiredDesignFields = [
            ["designPreset", "Design preset is required."],
            ["textureEmulation", "Texture is required."],
            ["typographyPairing", "Typography is required."],
            ["metallicAccents", "Metallic accent is required."],
            ["negativeSpace", "Padding is required."],
            ["monogramStyle", "Monogram style is required."],
            ["textAlignment", "Text alignment is required."],
            ["edgeStyling", "Border style is required."],
        ] as const;

        for (const [field, message] of requiredDesignFields) {
            if (!data[field]) {
                ctx.addIssue({ code: "custom", message, path: [field] });
            }
        }
    }
    if (data.characterKey) {
        if (data.activeTab === "upload" && !data.photoPlacement) {
            ctx.addIssue({
                code: "custom",
                message: "Choose how your photo should be used.",
                path: ["photoPlacement"],
            });
        }

        // A face swap keeps the example's own outfits, so attire only matters
        // when we compose a new portrait.
        const composesNewPortrait =
            data.activeTab === "describe" || data.photoPlacement === "FRAMED_INSET";

        if (!composesNewPortrait) return;

        if (data.photoType === "couple") {
            if (!data.brideAttireStyle) {
                ctx.addIssue({
                    code: "custom",
                    message: "Bride attire style is required.",
                    path: ["brideAttireStyle"],
                });
            }
            if (!data.groomAttireStyle) {
                ctx.addIssue({
                    code: "custom",
                    message: "Groom attire style is required.",
                    path: ["groomAttireStyle"],
                });
            }
        } else if (!data.singleAttireStyle) {
            ctx.addIssue({
                code: "custom",
                message: "Attire style is required.",
                path: ["singleAttireStyle"],
            });
        }
    }
});

export type AiInviteFormValues = z.infer<typeof aiInviteFormSchema>;
