export const statePath = (name: string) =>
  `/service-areas/${name.toLowerCase().replaceAll(" ", "-")}/`;
