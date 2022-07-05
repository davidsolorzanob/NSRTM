export class Contribuyente {
    // Contribuyente
    municipalidadId: number;
    contribuyenteNumero: number;
    fechaInscripcion: Date;
    fechaDJ: Date;
    numeroDJ: number;
    personaId: number;
    tipoPersonaId: number;
    motivoDjId: number;
    estadoDjId: number;
    modalidadOficio: number;
    tipoMedioDeterminacionId: number;
    medioDeterminacionId: number;
    segContribuyenteId: number;
    fuenteInformacionId: number;
    clave: string;
 // Auditoria
    usuarioCreacion: number;
    fechaCreacion: Date;
    terminalCreacion
    usuarioModificacion: number;
    fechaModificacion: Date;
    terminalModificacion: string;
// Persona
    docIdentidadId: number;
    numDocIdentidad: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    nombres: string;
    razonSocial: string;
    nombreCompleto: string;
    fechaNacimiento: string;
    genero: string;
    fallecido: number;
    fechaFallecimiento: Date;
}


