"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Mail, Key, Phone } from "lucide-react";

interface UserData {
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  phoneNumber?: string;
  isHouseOwner: boolean;
  isAdmin?: boolean;
  ownerId?: number;
  userId?: number;
}

export function SettingsUserInfo({ userData }: { userData: UserData }) {
  // Add null check and provide defaults
  if (!userData) {
    userData = {
      email: "user@example.com",
      firstName: "User",
      lastName: "Name",
      isHouseOwner: false,
      isAdmin: false,
    };
  }

  const displayName = `${userData.firstName || 'User'} ${userData.lastName || 'Name'}`;
  const initials = `${userData.firstName?.charAt(0) || 'U'}${userData.lastName?.charAt(0) || 'N'}`.toUpperCase();

  const getUserRole = () => {
    if (userData.isAdmin) return 'Admin';
    if (userData.isHouseOwner) return 'House Owner';
    return 'Tenant';
  };

  const getRoleVariant = () => {
    if (userData.isAdmin) return 'destructive';
    if (userData.isHouseOwner) return 'default';
    return 'secondary';
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your personal account details</CardDescription>
            </div>
          </div>
          <Badge variant={getRoleVariant()} className="ml-auto">
            {getUserRole()}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Profile Section */}
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="text-xl font-semibold bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold">{displayName}</h3>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>{userData.email}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Details Section */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">
            Account Details
          </h4>
          
          <div className="grid gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Email Address</label>
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{userData.email}</span>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">First Name</label>
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{userData.firstName || 'User'}</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Last Name</label>
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{userData.lastName || 'Name'}</span>
                </div>
              </div>
            </div>

            {userData.isHouseOwner && userData.phoneNumber && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{userData.phoneNumber}</span>
                </div>
              </div>
            )}

            {userData.isAdmin && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Role</label>
                <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                  <User className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium text-red-600">System Administrator</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Actions */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">
            Account Actions
          </h4>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="flex items-center gap-2" disabled>
              <Key className="h-4 w-4" />
              Reset Password
            </Button>
            <Button variant="outline" className="flex items-center gap-2" disabled>
              <User className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Profile editing and password reset features are coming soon.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}