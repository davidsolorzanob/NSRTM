export interface ContribuyenteProduct
{
    id: string;
    category?: string;
    name: string;
    description?: string;
    tags?: string[];
    sku?: string | null;
    barcode?: string | null;
    brand?: string | null;
    vendor: string | null;
    stock: number;
    reserved: number;
    cost: number;
    basePrice: number;
    taxPercent: number;
    price: number;
    weight: number;
    thumbnail: string;
    images: string[];
    active: boolean;
}

export interface ContribuyentePagination
{
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}

export interface ContribuyenteCategory
{
    id: string;
    parentId: string;
    name: string;
    slug: string;
}

export interface ContribuyenteBrand
{
    id: string;
    name: string;
    slug: string;
}

export interface ContribuyenteTag
{
    id?: string;
    title?: string;
}

export interface ContribuyenteVendor
{
    id: string;
    name: string;
    slug: string;
}



export interface ViasProduct
{
    id: string;
    category?: string;
    name: string;
    description?: string;
    tags?: string[];
    sku?: string | null;
    barcode?: string | null;
    brand?: string | null;
    vendor: string | null;
    stock: number;
    reserved: number;
    cost: number;
    basePrice: number;
    taxPercent: number;
    price: number;
    weight: number;
    thumbnail: string;
    images: string[];
    active: boolean;
}