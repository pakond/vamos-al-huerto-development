
export interface Parcela {
    $key: string;
    nombre: string;
    ancho: number;
    alto: number;
    owner: string;
}

export interface Posicion {
    lat: number;
    lng: number;
}

export interface Plantacion {
    $key: string; // misma key que la parcela
    planta: Planta[];
}

export interface Planta {
    especie: string;
    fechaPlantado: number;
    fechaCosechado?: number;
    posicionVertical: number;
    posicionHorizontal: number;
}

export interface Especie {
    $key: string;
    nombre: string;
    descripcion?: string;
    categoria?: string;
    espacio: number;
    profundidad?: number;
    riego?: number;
    luz?: string;
    mesesPlantacion?: string[];
    tiempoCultivo: number;
    icono?: string;
}

export interface Foto {
    $key: string;
    data: string;
}
