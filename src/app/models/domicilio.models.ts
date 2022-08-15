export class Domicilio{
    contribuyenteId:number;
    contribuyenteDomicilioId: number;
    departamento: string;
    provincia: string;
    distrito: string;
    departamentoId: number;
    provinciaId: number;
    distritoId: number;
    tipoDomicilio: string;
    tipoHabilitacion: string;
    nombreHabilitacion: string;
    tipoVia: string;
    nombreVia: string;
    numeroMunicipal: string;
    loteUrbano: string;
    numeroAlterno: string;
    manzanaUrbana: string;
    block: string;
    numeroDpto: string;
    interior: string;
    cuadra: string;
    kilometro: string;
    referencia: string;
    telefono: string;
    usuarioRegistro: string;
    fechaRegistro: string;
    usuarioEdicion: string;
    fechaEdicion: string;
    viaDepartamentoId: number;
    viaProvinciaId: number;
    viaDistritoId: number;
    tipoPredioId:number;
    tipoZonaUrbanaId:number;
    edificacionId:number;
    tipoEdificacionId:number;

        // Auditoria
        usuarioCreacion: number;
        fechaCreacion: Date;
        terminalCreacion: string;
        usuarioModificacion: number;
        fechaModificacion: Date;
        terminalModificacion: string;
}
