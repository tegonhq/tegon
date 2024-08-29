import Passwordless from 'supertokens-node/recipe/passwordless';

export async function createMagicLink(email: string) {
  const magicLink = await Passwordless.createMagicLink({
    email,
    tenantId: 'public',
  });

  return magicLink;
}
