export type ProductCategoryDto = {
  id: string;
  name: string;
  tenant_id: string;
};

export type ProductIndustryDto = {
  id: string;
  name: string;
  tenant_id: string;
};

export type ProductCatIndForm = {
  name: string;
};

export type ProductForm = {
  brand: string;
  category_id: string;
  description?: string;
  industry_id: string;
  media_ids?: string[];
  name: string;
  price: number;
  tags?: string[];
};

export type ProductDto = {
  id: string;
  name: string;
  description: string;
  price: number;
  brand: string;
  category_id: string;
  industry_id: string;
  tenant_id: string;
  category: ProductCategoryDto;
  industry: ProductIndustryDto;
  tags: string[];
};
