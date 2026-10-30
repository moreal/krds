const owners=new WeakMap<Document,symbol>();
export function claimCoach(doc:Document,owner:symbol){const previous=owners.get(doc);if(previous&&previous!==owner)throw new TypeError('Only one CoachMark may be open in a document');owners.set(doc,owner);return()=>{if(owners.get(doc)===owner)owners.delete(doc);};}
