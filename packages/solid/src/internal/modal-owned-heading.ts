import { createContext } from 'solid-js';
/** Private native composition transport: a composing surface (BottomSheet) renders the Modal's title and description itself,
 * inside its own header, while the Modal keeps labelling (titleId/descriptionId), layering, focus and dismissal.
 * The value is the composing surface's own title id, so only the Modal that receives that same titleId yields its heading;
 * public Modals nested in the surface body keep their own title. */
export const ModalOwnedHeading = createContext<string | undefined>();
