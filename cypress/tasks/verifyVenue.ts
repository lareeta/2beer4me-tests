import prisma from '../../src/lib/prisma'

export default async function verifyVenue(venueId: string) {
  return prisma.venue.update({
    where: { id: venueId },
    data: { isVerified: true },
  })
}
