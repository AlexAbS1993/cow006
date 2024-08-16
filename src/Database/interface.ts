export interface IDBModel<Model> {
    getById(id: string):Model
    getByField<ValueType>(field: string, value: ValueType):Model
    save(data:Model):void
    update(data: Model):void
}