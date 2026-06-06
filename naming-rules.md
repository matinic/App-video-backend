### Para nombrar propiedades dentro de esquemas u objetos seguir el siguiente patron de guia

```
[entidad][rol][propiedad]
ej userFollowerId
si es un dto el primer caracter en mayúscula porque es un tipo
ej dto: UserFollowDto
```

### Para dto, schema, servicio, controller o cualquier otro metodo de consulta

```
[metodo][entidad][?rol][?propiedad] /? [dto] || [schema]
ej getUserFollowers
ej schema getUserFollowesSchema
ej dto GetUserFollowersDto
```

