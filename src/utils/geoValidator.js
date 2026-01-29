/**
 * Utilidad para validar datos geoespaciales (PostGIS)
 */
const geoValidator = {
  /**
   * Valida si un objeto GeoJSON es un polígono válido
   * @param {Object} geojson - El objeto a validar
   * @returns {Boolean}
   */
  isPolygonValid: (geojson) => {
    if (!geojson || geojson.type !== 'Polygon') return false;
    
    const coordinates = geojson.coordinates;
    // Un polígono debe tener al menos un anillo (el exterior)
    if (!Array.isArray(coordinates) || coordinates.length === 0) return false;
    
    const exteriorRing = coordinates[0];
    // Un anillo exterior debe tener al menos 4 puntos (el último cierra el polígono)
    if (exteriorRing.length < 4) return false;
    
    // El primer y último punto deben ser iguales para cerrar la figura
    const firstPoint = exteriorRing[0];
    const lastPoint = exteriorRing[exteriorRing.length - 1];
    
    return firstPoint[0] === lastPoint[0] && firstPoint[1] === lastPoint[1];
  },

  /**
   * Calcula si el área es razonable (ejemplo: no permitir terrenos de 0 hectáreas)
   */
  hasValidArea: (area) => {
    return typeof area === 'number' && area > 0;
  }
};

module.exports = geoValidator;