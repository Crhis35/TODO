import { model, Schema, Document, SchemaTypes } from 'mongoose';
export interface IItem extends Document {
  title: string;
  description: string;
  image: string;
}

const itemSchema = new Schema(
  {
    title: { type: SchemaTypes.String, required: true },
    description: { type: SchemaTypes.String, required: true },
    image: { type: SchemaTypes.String },
  },
  { timestamps: true }
);

const Item = model<IItem>('Item', itemSchema);

export default Item;
