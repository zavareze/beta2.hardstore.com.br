export interface ICustomFields {
    [key: string]: any;
}

export interface IBaseCategory {
    type: string;
    id: number;
    pai: number;
    slug: string;
    name: string;
    image?: string;
    items?: number;
    parent?: this;
    children?: this[];
    customFields: ICustomFields;
    meta_title: string;
    meta_description: string;
    texto_seo: string;
}

export interface IShopCategory extends IBaseCategory {
    type: 'shop';
}

export interface IBlogCategory extends IBaseCategory {
    type: 'blog';
}

export type ICategory = IShopCategory | IBlogCategory;
