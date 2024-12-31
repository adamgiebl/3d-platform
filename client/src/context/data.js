import { mockImages } from "../utils/mockData";

export const mockPosts = [
  {
    objectId: 1,
    name: "Abstract Sculpture",
    author: {
      objectId: "1",
      name: "Jane Smith",
      avatar: mockImages.users[0],
    },
    description: "A modern take on abstract art in 3D",
    modelUrl:
      "https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf",
    likes: 42,
    comments: [
      {
        objectId: 1,
        author: {
          objectId: "2",
          name: "John Doe",
          avatar: mockImages.users[1],
        },
        content: "Amazing work! Love the details.",
        createdAt: "2024-03-20T10:00:00Z",
      },
    ],
    tags: ["abstract", "sculpture", "modern"],
    createdAt: "2024-03-19T15:30:00Z",
  },
  {
    objectId: 2,
    name: "Character Model",
    author: {
      objectId: "2",
      name: "John Doe",
      avatar: mockImages.users[1],
    },
    description: "Fantasy character design for an upcoming game",
    modelUrl:
      "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Cube/glTF/Cube.gltf",
    likes: 28,
    comments: [],
    tags: ["character", "fantasy", "game"],
    createdAt: "2024-03-18T09:15:00Z",
  },
  {
    objectId: 3,
    name: "Sci-fi Prop",
    author: {
      objectId: "3",
      name: "Alice Johnson",
      avatar: mockImages.users[2],
    },
    description: "A futuristic sci-fi prop design",
    modelUrl:
      "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Lantern/glTF/Lantern.gltf",
    likes: 35,
    comments: [],
    tags: ["sci-fi", "prop", "design"],
    createdAt: "2024-03-17T14:20:00Z",
  },
];
