export const getInputs = async () => {
  return {
    type: 'object',
    properties: {
      techStack: {
        type: 'text',
        title: 'Tech stack used in this project',
        validation: {
          required: true,
        },
      },
    },
  };
};
