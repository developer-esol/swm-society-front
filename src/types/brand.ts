export interface Brand {
    id: string;
    name: string;           // Based on your database structure
    brandName?: string;     // Keep as optional for backward compatibility
    description: string;
    url?: string;
    isActive: boolean;
    route?: string;
}