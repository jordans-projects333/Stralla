import { create } from 'zustand'

export const useStore = create((set) => ({
    name: 'harry',
    price: 0,
    deleteToggle: false,
    addToggledTo: '',
    deleteSvgToggle: false,
    editSvgToggle: false,
    editClicked: false,
    editableSvgTitle: '',
    editableSvgCode: '',
    editableSvgId: 0,
    svgFilter: '',
    isInsideNote: false,
    idOfNoteOrFolder: 1,

    bluredBackgroundToggle: false,
    addNoteToggle: false,
    addFolderToggle: false,
    addNotesWindowToggle: false,
    notesEditToggle: false,
    notesDeleteToggle: false,

    addComponentFolderToggle: false,
    addComponentToggle: false,
    componentsDeleteToggle: false,
    componentsEditToggle: false,
    }
))