/**
 * JJK Character Showcase
 * Copyright (c) 2026 shipwithsimo
 */

export type MousePosition = {
  x: number;
  y: number;
};

export type CharacterInfo = {
  id: string;
  displayName: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
};

export type Character = CharacterInfo;

export type ModalState = {
  isOpen: boolean;
  characterId: string | null;
  initialSceneIndex: number;
};

export type LockedPreview = string | null;

export type Rotation3D = {
  rotateX: number;
  rotateY: number;
};
