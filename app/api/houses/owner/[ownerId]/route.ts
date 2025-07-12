import { NextRequest, NextResponse } from 'next/server';
import { getHousesByOwnerId } from '@/services/houseOwnerService';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ownerId: string }> }
) {
  try {
    const { ownerId: ownerIdString } = await params;
    const ownerId = parseInt(ownerIdString);
    
    if (isNaN(ownerId)) {
      return NextResponse.json({ error: 'Invalid owner ID' }, { status: 400 });
    }

    const houses = await getHousesByOwnerId(ownerId);
    return NextResponse.json(houses);
  } catch (error) {
    console.error('Error fetching houses by owner:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
