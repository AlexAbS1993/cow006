export interface IDBModel<Model> {
    getById(id: string):Promise<Model>
    getByField<ValueType>(field: string, value: ValueType):Promise<Model>
    save(data:Model):Promise<void>
    update(data: Model):Promise<void>
}