# CRUD de Playlist - Documentación Completa

## Endpoints Implementados

### 1. Crear Playlist
**POST** `/api/playlist`
```json
{
  "name": "Mi Playlist",
  "description": "Descripción opcional"
}
```
**Respuesta**: Playlist creada con ID, fecha y conteo de videos

---

### 2. Obtener Playlist por ID
**GET** `/api/playlist/:id`
**Parámetros**: `id` (UUID)
**Respuesta**: Playlist con todos sus videos, usuario propietario y metadatos

---

### 3. Obtener Playlists del Usuario
**GET** `/api/playlist`
**Query params**: `take`, `skip` (paginación)
**Respuesta**: Array de playlists del usuario autenticado

---

### 4. Actualizar Playlist
**PUT** `/api/playlist/:id`
```json
{
  "id": "playlist-id",
  "name": "Nuevo nombre",
  "description": "Nueva descripción"
}
```
**Validación**: Solo el propietario puede actualizar
**Respuesta**: Playlist actualizada

---

### 5. Agregar Video a Playlist
**POST** `/api/playlist/video/add`
```json
{
  "playlistId": "playlist-id",
  "videoId": "video-id"
}
```
**Validaciones**:
- Playlist existe
- Video existe
- Propietario de playlist
- Video no está ya en la playlist
**Respuesta**: Playlist actualizada con conteo de videos

---

### 6. Remover Video de Playlist
**DELETE** `/api/playlist/video/remove`
```json
{
  "playlistId": "playlist-id",
  "videoId": "video-id"
}
```
**Validación**: Solo propietario
**Respuesta**: Playlist actualizada

---

### 7. Eliminar Playlist
**DELETE** `/api/playlist/:id`
**Validación**: Solo propietario
**Respuesta**: Confirmación de eliminación

---

## Estructura de Datos

```typescript
interface Playlist {
  id: string                    // UUID
  name: string                  // 1-255 caracteres
  description?: string          // Máx 1000 caracteres
  userId: string                // Propietario
  createdAt: DateTime
  updatedAt: DateTime
  videos: Video[]               // Relación M2M
  _count: {
    videos: number              // Cantidad de videos
  }
}
```

---

## Validaciones Implementadas

| Campo | Tipo | Validación |
|-------|------|-----------|
| name | string | 1-255 caracteres |
| description | string | Máx 1000 caracteres |
| playlistId | UUID | Debe existir |
| videoId | UUID | Debe existir |
| userId | UUID | Del usuario autenticado |

---

## Errores Esperados

| Código | Mensaje | Causa |
|--------|---------|-------|
| 400 | Bad Request | Validación fallida |
| 401 | Unauthorized | No autenticado |
| 403 | Forbidden | No tiene permisos (no es propietario) |
| 404 | Not Found | Playlist o video no existe |
| 409 | Conflict | Video ya está en la playlist |
| 500 | Server Error | Error interno |

---

## Características Principales

✅ **CRUD Completo**
- Create: Crear playlist
- Read: Obtener playlist o listar del usuario
- Update: Modificar nombre/descripción
- Delete: Eliminar playlist

✅ **Gestión de Videos**
- Agregar videos a playlist
- Remover videos de playlist
- Consultar videos en playlist

✅ **Control de Acceso**
- Solo propietario puede editar/eliminar
- Validación de permisos en todas las operaciones

✅ **Paginación**
- Soporte para `take` y `skip`
- Ordenado por fecha de creación (descendente)

✅ **Validaciones**
- Zod schemas para todas las operaciones
- Validación de existencia de recursos
- Prevención de duplicados

---

## Ejemplos de Uso

### Crear playlist
```bash
curl -X POST http://localhost:3000/api/playlist \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mis Videos Favoritos",
    "description": "Los mejores videos que he visto"
  }'
```

### Obtener playlists del usuario
```bash
curl -X GET "http://localhost:3000/api/playlist?take=10&skip=0" \
  -H "Authorization: Bearer TOKEN"
```

### Agregar video a playlist
```bash
curl -X POST http://localhost:3000/api/playlist/video/add \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "playlistId": "abc123",
    "videoId": "def456"
  }'
```

### Actualizar playlist
```bash
curl -X PUT http://localhost:3000/api/playlist/abc123 \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "abc123",
    "name": "Nuevo nombre",
    "description": "Nueva descripción"
  }'
```

### Eliminar playlist
```bash
curl -X DELETE http://localhost:3000/api/playlist/abc123 \
  -H "Authorization: Bearer TOKEN"
```

---

## Archivos Creados/Modificados

- ✅ `src/services/playlist.service.ts` — Lógica de negocio
- ✅ `src/controllers/playlist.controller.ts` — Manejo de solicitudes
- ✅ `src/routes/playlist.route.ts` — Definición de rutas
- ✅ `src/lib/zod/schemas/playlist.ts` — Validaciones
- ✅ `src/lib/zod/dto/playlist.ts` — DTOs TypeScript
- ✅ `src/routes/index.ts` — Registro de rutas

---

## Próximas Mejoras Opcionales

- [ ] Compartir playlists con otros usuarios
- [ ] Playlists públicas/privadas
- [ ] Ordenar videos dentro de playlist
- [ ] Duplicar playlist
- [ ] Comentarios en playlists
- [ ] Búsqueda de playlists
- [ ] Recomendaciones basadas en playlists
