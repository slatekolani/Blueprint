// Minimal company shape required by RequestServiceModal — satisfied by both
// full Company objects and the slimmer picks loaded on project/service pages.
export type CompanyBrief = Pick<Company, 'id' | 'name' | 'short_name' | 'primary_color' | 'logo_path'>;

export type Company = {
    id: number;
    parent_id?: number | null;
    name: string;
    slug: string;
    short_name?: string;
    tagline?: string;
    summary?: string;
    description?: string;
    logo_path?: string;
    hero_image_path?: string;
    primary_color: string;
    accent_color: string;
    email?: string;
    phone?: string;
    website?: string;
    address?: string;
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    meta_title?: string;
    meta_description?: string;
    is_parent: boolean;
    is_featured: boolean;
    is_published: boolean;
    sort_order: number;
    services?: Service[];
    projects?: Project[];
    services_count?: number;
};

export type Service = {
    id: number;
    company_id: number;
    name: string;
    slug: string;
    category?: string;
    price?: string;
    icon?: string;
    summary?: string;
    description?: string;
    image_path?: string;
    is_featured: boolean;
    is_published: boolean;
    sort_order: number;
    company?: Pick<Company, 'id' | 'name' | 'slug' | 'short_name' | 'hero_image_path' | 'primary_color'>;
};

export type Project = {
    id: number;
    company_id: number;
    title: string;
    slug: string;
    category?: string;
    summary?: string;
    description?: string;
    client?: string;
    location?: string;
    completed_at?: string;
    cover_image_path?: string;
    is_featured: boolean;
    is_published: boolean;
    sort_order: number;
    company?: Pick<Company, 'id' | 'name' | 'slug' | 'short_name' | 'primary_color' | 'accent_color' | 'logo_path' | 'email'>;
};

export type Inquiry = {
    id: number;
    company_id?: number;
    service_id?: number;
    type: string;
    name: string;
    email?: string;
    phone: string;
    organization?: string;
    subject?: string;
    message: string;
    status: string;
    admin_notes?: string;
    created_at: string;
    company?: Pick<Company, 'id' | 'name'>;
    service?: Pick<Service, 'id' | 'name'>;
};

export type Client = {
    id: number;
    uuid: string;
    name: string;
    logo_path?: string;
    description?: string;
    website?: string;
    sort_order: number;
    is_published: boolean;
};

export const mediaUrl = (path?: string) => {
    if (!path) return '';
    if (path.startsWith('/') || path.startsWith('http')) return path;
    return `/${path}`;
};

export const formatServicePrice = (price?: string) => price?.trim() || 'Price on request';
