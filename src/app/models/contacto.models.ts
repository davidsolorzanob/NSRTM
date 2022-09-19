export class Contacto {
    municipalidadId: number;
    contribuyenteNumero: number;
    contactoContribuyenteId: number;
    tipoMedioContactoId: number;
    desTipoMedioContacto: string;
    claseMedioContactoId: number;
    desClaseMedioContacto: string;
    desMedioContacto: string;
    principal: number;
    estadoId: number;
    // Auditoria
    usuarioCreacion: number;
    fechaCreacion: Date;
    terminalCreacion: string;
    usuarioModificacion: number;
    fechaModificacion: Date;
    terminalModificacion: string;
}


