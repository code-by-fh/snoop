export function leanTransformPlugin(schema) {
  schema.post('find', transform);
  schema.post('findOne', transform);
  schema.post('findOneAndUpdate', transform);
  schema.post('findById', transform);

  function transform(docs) {
    if (!Array.isArray(docs)) docs = [docs];
    for (const doc of docs) {
      if (doc && typeof doc === 'object') {
        doc.id = doc._id;
        delete doc._id;
        delete doc.__v;
      }
    }
  }
}
