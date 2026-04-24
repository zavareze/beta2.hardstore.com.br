import type { IBrand } from './brand'
import type { IFilter } from './filter'
import type { IFilterableList, IPaginatedList } from './list'
import type { IShopCategory } from './category'

export interface IProductAttributeValue {
    slug: string;
    name: string;
}

export interface IProductAttribute {
    slug: string;
    name: string;
    values: IProductAttributeValue[];
    featured: boolean;
}

export interface IProduct {
    id: number;
    slug: string;
    name: string;
    images: string[];
    price: number;
    peso: number;
    stock: boolean;
    stock_caxias: boolean;
    compareAtPrice: number | null;
    brand: IBrand | null;
    badges: string[];
    categories: IShopCategory[];
    tags_categoria?: { id: number; name: string; slug: string }[];
    reviews: number;
    rating: number;
    attributes: IProductAttribute[];
    availability: string;
    specification: string;
    specification2?: string;
    specification3?: string;
    description: string;
    caracteristics: string;
    weight: number;
    status: number;
}

export type IProductsList = IPaginatedList<IProduct> & IFilterableList<IProduct, IFilter>;
