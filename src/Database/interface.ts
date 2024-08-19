export interface IDBModel<Model> {
    getById(id: string):Promise<Model |null >
    getByField<ValueType>(field: string, value: ValueType):Promise<Model|null>
    save(data:Model):Promise<void>
    update(data: Model):Promise<void>
}