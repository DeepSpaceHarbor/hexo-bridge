import { Position, Toaster } from "@blueprintjs/core";

/** Singleton toaster instance. Create separate instances for different options. */
export const Notification = Toaster.create({
  position: Position.TOP,
});
