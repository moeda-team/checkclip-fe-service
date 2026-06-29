import TagInput from "@/components/form/TagInput";
import FormModal from "@/components/modal/FormModal";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Check, DollarSign, Plus, X } from "lucide-react";

import { SetStateAction, useEffect, useState } from "react";
import {
  useGetProductsCategory,
  useGetProductsIndustry,
  usePostProduct,
  usePostProductCategory,
  usePostProductIndustry,
} from "../../hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import LoadingSpinner from "@/components/LoadingSpinner";
import FileDropzone from "@/components/form/FileDropzone";
import FilePreviewThumb, {
  UploadFile,
} from "@/components/form/FilePreviewThumb";
import { Switch } from "@/components/ui/switch";

interface PreviewFile extends File {
  id: string;
  previewUrl: string;
}

const uploadFileSchema = z.object({
  id: z.string(),
  file: z.instanceof(File),
  previewUrl: z.string(),
});

const productSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Product name is required")
      .max(120, "Product name is too long"),
    category_id: z.string().trim().min(1, "Product category is required"),
    price: z
      .number({ message: "Price is required" })
      .positive("Price must be greater than 0"),
    brand: z.string().trim().min(1, "Brand is required"),
    industry_id: z.string().trim().min(1, "Product industry is required"),
    description: z.string().trim().max(2000, "Description is too long"),
    tags: z.array(z.string()),
    images: z.array(uploadFileSchema),
    is_video_url_mode: z.boolean(),
    video_url: z.string().trim().optional(),
    videos: z.array(uploadFileSchema).optional(),
  })
  .refine(
    (data) => {
      if (data.is_video_url_mode)
        return !!data.video_url && data.video_url.length > 0;
      return true;
    },
    { message: "Video URL is required", path: ["video_url"] },
  );

type ProductFormValues = z.infer<typeof productSchema>;

const defaultValues: ProductFormValues = {
  name: "",
  category_id: "",
  price: undefined as unknown as number,
  brand: "",
  industry_id: "",
  tags: [],
  description: "",
  images: [],
  is_video_url_mode: false,
  video_url: "",
  videos: [],
};

function RequiredIcon() {
  return <span className="text-red-500">*</span>;
}

export default function ProductFormModal({
  isOpen,
  onClose,
  setStatusHandle,
}: {
  isOpen?: boolean;
  onClose?: () => void;
  setStatusHandle?: React.Dispatch<SetStateAction<string>>;
}) {
  const [isAddCategory, setIsAddCategory] = useState<boolean>(false);
  const [isAddIndustry, setIsAddIndustry] = useState<boolean>(false);
  const [listInput, setListInput] = useState<{
    category?: string;
    industry?: string;
  }>();
  const [submitStatusList, setSubmitStatusList] = useState<{
    category?: string;
    industry?: string;
  }>();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues,
  });

  const { data: categoryData, isFetching: categoryFetching } =
    useGetProductsCategory("");
  const { data: industryData, isFetching: industryFetching } =
    useGetProductsIndustry("");
  const { mutate: categoryMutate, isPending: categoryPending } =
    usePostProductCategory();
  const { mutate: industryMutate, isPending: industryPending } =
    usePostProductIndustry();
  const { mutate: productMutate, isPending: productPending } = usePostProduct();

  const handleAddCategory = () => {
    const payload = {
      name: listInput?.category ?? "",
    };

    categoryMutate(payload, {
      onSuccess: () => {
        setSubmitStatusList((prev) => ({
          ...prev,
          category: "Add new list successful",
        }));
      },
      onError: (e) => {
        setSubmitStatusList((prev) => ({
          ...prev,
          category: e.message,
        }));
      },
      onSettled: () => {
        setIsAddCategory(false);
        setListInput((prev) => ({ ...prev, category: "" }));
      },
    });
  };

  const handleAddIndustry = () => {
    const payload = {
      name: listInput?.industry ?? "",
    };

    industryMutate(payload, {
      onSuccess: () => {
        setSubmitStatusList((prev) => ({
          ...prev,
          industry: "Add new list successful",
        }));
      },
      onError: (e) => {
        setSubmitStatusList((prev) => ({
          ...prev,
          industry: e.message,
        }));
      },
      onSettled: () => {
        setIsAddIndustry(false);
        setListInput((prev) => ({ ...prev, industry: "" }));
      },
    });
  };

  const handleClose = () => {
    reset(defaultValues);
    onClose?.();
  };

  const onSubmit = (values: ProductFormValues) => {
    productMutate(values, {
      onSuccess: () => {
        setStatusHandle?.("success-create");
      },
      onError: () => {
        setStatusHandle?.("error-create");
      },
      onSettled: () => {
        handleClose();
      },
    });
  };

  return (
    <FormModal
      isOpen={isOpen ? isOpen : false}
      title="Add New Product"
      icon={<Plus size={16} className="text-primary-500" />}
      onClose={handleClose}
      onSubmit={handleSubmit(onSubmit)}
      submitLabel="Save"
    >
      <div>
        <label className="p-1 text-sm font-medium">
          Product Name
          <RequiredIcon />
        </label>
        <Input
          type="text"
          placeholder="Input product name"
          {...register("name")}
        />
        {errors.name && (
          <p className="px-1 pt-1 text-xs text-destructive">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="flex items-start gap-6">
        <div className="w-full">
          <div className="flex items-center justify-between h-6">
            <label className="p-1 text-sm font-medium">
              Product Category
              <RequiredIcon />
            </label>
            <span
              onClick={() => setIsAddCategory(!isAddCategory)}
              className="text-info text-xs font-semibold cursor-pointer"
            >
              Add New List
            </span>
          </div>

          <Controller
            name="category_id"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="border border-border shadow-xs">
                  <SelectValue placeholder="Select product category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryFetching ? (
                    <SelectItem value="loading" disabled>
                      Loading...
                    </SelectItem>
                  ) : (
                    categoryData?.data.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            )}
          />

          {isAddCategory && (
            <div className="mt-3 flex items-center gap-2">
              <Input
                placeholder="Add new list"
                value={listInput?.category}
                onChange={(e) => {
                  setListInput((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }));
                }}
              />
              <Button
                variant="secondary"
                onClick={() => {
                  setIsAddCategory(false);
                }}
                className="w-7 h-7"
              >
                <X size={16} />
              </Button>
              <Button
                variant="outline"
                onClick={handleAddCategory}
                className="w-7 h-7"
              >
                {categoryPending ? <LoadingSpinner /> : <Check size={16} />}
              </Button>
            </div>
          )}

          {submitStatusList?.category ? (
            <span
              className={`text-xs ${submitStatusList.category.includes("success") && "text-success"}`}
            >
              {submitStatusList.category}
            </span>
          ) : (
            errors.category_id && (
              <p className="px-1 pt-1 text-xs text-destructive">
                {errors.category_id.message}
              </p>
            )
          )}
        </div>

        <div className="w-full">
          <label className="p-1 text-sm font-medium">
            Price
            <RequiredIcon />
          </label>
          <div className="relative">
            <DollarSign
              size={16}
              className="text-muted-foreground absolute bottom-1/2 left-2 translate-y-1/2"
            />
            <Input
              type="number"
              placeholder="Input price"
              className="pl-8"
              {...register("price", { valueAsNumber: true })}
            />
          </div>

          {errors.price && (
            <p className="px-1 pt-1 text-xs text-destructive">
              {errors.price.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-start gap-6">
        <div className="w-full">
          <label className="p-1 text-sm font-medium">
            Brand
            <RequiredIcon />
          </label>
          <Input type="text" placeholder="Input brand" {...register("brand")} />
          {errors.brand && (
            <p className="px-1 pt-1 text-xs text-destructive">
              {errors.brand.message}
            </p>
          )}
        </div>

        <div className="w-full">
          <div className="flex items-center justify-between h-6">
            <label className="p-1 text-sm font-medium">
              Product Industry
              <RequiredIcon />
            </label>
            <span
              onClick={() => setIsAddIndustry(!isAddIndustry)}
              className="text-info text-xs font-semibold cursor-pointer"
            >
              Add New List
            </span>
          </div>

          <Controller
            name="industry_id"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="border border-border shadow-xs">
                  <SelectValue placeholder="Select product industry" />
                </SelectTrigger>
                <SelectContent>
                  {industryFetching ? (
                    <SelectItem value="loading" disabled>
                      Loading...
                    </SelectItem>
                  ) : (
                    industryData?.data.map((ind) => (
                      <SelectItem key={ind.id} value={ind.id}>
                        {ind.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            )}
          />

          {isAddIndustry && (
            <div className="mt-3 flex items-center gap-2">
              <Input
                placeholder="Add new list"
                value={listInput?.industry}
                onChange={(e) => {
                  setListInput((prev) => ({
                    ...prev,
                    industry: e.target.value,
                  }));
                }}
              />
              <Button
                variant="secondary"
                onClick={() => {
                  setIsAddIndustry(false);
                }}
                className="w-7 h-7"
              >
                <X size={16} />
              </Button>
              <Button
                variant="outline"
                onClick={handleAddIndustry}
                className="w-7 h-7"
              >
                {industryPending ? <LoadingSpinner /> : <Check size={16} />}
              </Button>
            </div>
          )}

          {submitStatusList?.industry ? (
            <span
              className={`text-xs ${submitStatusList.industry.includes("success") && "text-success"}`}
            >
              {submitStatusList?.industry}
            </span>
          ) : (
            errors.industry_id && (
              <p className="px-1 pt-1 text-xs text-destructive">
                {errors.industry_id.message}
              </p>
            )
          )}
        </div>
      </div>

      <div>
        <Controller
          name="tags"
          control={control}
          render={({ field }) => (
            <TagInput tags={field.value} onChange={field.onChange} />
          )}
        />
        {errors.tags && (
          <p className="px-1 pt-1 text-xs text-destructive">
            {errors.tags.message}
          </p>
        )}
      </div>

      <div className="w-full">
        <label className="p-1 text-sm font-medium">
          Production Description
        </label>
        <Textarea
          placeholder="Type here"
          className="resize-y"
          {...register("description")}
        />
        {errors.description && (
          <p className="px-1 pt-1 text-xs text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      <Controller
        name="images"
        control={control}
        render={({ field }) => {
          const handleFilesSelected = (files: File[]) => {
            const newItems: UploadFile[] = files.map((file) => ({
              id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
              file,
              previewUrl: URL.createObjectURL(file),
            }));
            field.onChange([...(field.value ?? []), ...newItems]);
          };

          const handleRemove = (id: string) => {
            const currentValues = field.value ?? [];
            const target = currentValues.find((v) => v.id === id);

            if (target?.previewUrl) {
              URL.revokeObjectURL(target.previewUrl);
            }
            field.onChange(currentValues.filter((v) => v.id !== id));
          };

          return (
            <div>
              <label className="p-1 text-sm font-medium">Upload Image</label>
              <FileDropzone
                accept="image/png, image/jpeg, image/webp"
                onFilesSelected={handleFilesSelected}
                primaryLabel="Click to upload or drag & drop"
                helperLabel="PNG, JPG, or WEBP (Max. 5MB)"
              />

              {field.value?.length > 0 && (
                <div className="flex items-center gap-2 pt-3">
                  <div className="flex flex-wrap gap-2">
                    {field.value.map((item) => (
                      <FilePreviewThumb
                        key={item.id}
                        item={item}
                        onRemove={handleRemove}
                      />
                    ))}
                  </div>
                </div>
              )}

              {errors.images && (
                <p className="px-1 pt-1 text-xs text-destructive">
                  {errors.images.message}
                </p>
              )}
            </div>
          );
        }}
      />

      <Controller
        name="is_video_url_mode"
        control={control}
        render={({ field: toggleField }) => (
          <Controller
            name="videos"
            control={control}
            render={({ field: videosField }) => {
              const handleFilesSelected = (files: File[]) => {
                const newItems: UploadFile[] = files.map((file) => ({
                  id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
                  file,
                  previewUrl: URL.createObjectURL(file),
                }));
                videosField.onChange([
                  ...(videosField.value ?? []),
                  ...newItems,
                ]);
              };

              const handleRemove = (id: string) => {
                const currentValues = videosField.value ?? [];
                const target = currentValues.find((v) => v.id === id);

                if (target?.previewUrl) {
                  URL.revokeObjectURL(target.previewUrl);
                }
                videosField.onChange(currentValues.filter((v) => v.id !== id));
              };
              return (
                <div>
                  <div className="flex items-center justify-between">
                    <label className="p-1 text-sm font-medium">
                      Upload Video
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Video URL</span>
                      <Switch
                        checked={toggleField.value}
                        onCheckedChange={toggleField.onChange}
                      />
                    </div>
                  </div>

                  {toggleField.value ? (
                    <Input
                      type="url"
                      placeholder="Paste video URL (e.g. https://...)"
                      {...register("video_url")}
                    />
                  ) : (
                    <>
                      <FileDropzone
                        accept="video/mp4, video/quicktime"
                        onFilesSelected={handleFilesSelected}
                        primaryLabel="Drag & drop files here, or click to select files"
                        helperLabel="MP4, MOV (Max. 50MB)"
                      />
                      {(videosField.value ?? []).length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-3">
                          {(videosField.value ?? []).map((item) => (
                            <FilePreviewThumb
                              key={item.id}
                              item={item}
                              onRemove={handleRemove}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {errors.video_url && (
                    <p className="px-1 pt-1 text-xs text-destructive">
                      {errors.video_url.message}
                    </p>
                  )}
                </div>
              );
            }}
          />
        )}
      />
    </FormModal>
  );
}
