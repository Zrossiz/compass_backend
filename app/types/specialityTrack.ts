export type CreateSpecialityTrackDTO = {
  specialityId: number;
  title: string;
  imageLink: string;
  sortOrder: number;
};

export type UpdateSpecialityTrackDTO = Omit<CreateSpecialityTrackDTO, 'imageLink'> & { imageLink?: string };
