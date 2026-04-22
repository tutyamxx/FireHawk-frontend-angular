export interface Car {
    id: string;

    name?: string;

    mpg?: number;
    cylinders?: number;
    displacement?: number;
    horsepower?: number;
    weight?: number;
    acceleration?: number;
    model_year?: number;
    origin?: string;

    make?: string;
    model?: string;
    efficiency?: 'High' | 'Medium' | 'Low';
}
