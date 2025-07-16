"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Mail, Key } from "lucide-react";

export function SettingsUserInfo() {
  const [user, setUser] = useState<{ 
    email: string; 
    firstName?: string; 
    lastName?: string; 
    name?: string;
    isHouseOwner: boolean;
    ownerId?: number;
    userId?: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-muted rounded-full animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-5 bg-muted rounded w-32 animate-pulse"></div>
              <div className="h-4 bg-muted rounded w-24 animate-pulse"></div>
            </div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Unable to load user information</p>
        </CardContent>
      </Card>
    );
  }

  const displayName = `${user.firstName} ${user.lastName}`;
  const initials = `${user.firstName?.charAt(0)}${user.lastName?.charAt(0)}`.toUpperCase();

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
          <Badge variant={user.isHouseOwner ? "default" : "secondary"} className="ml-auto">
            {user.isHouseOwner ? 'House Owner' : 'Tenant'}
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
              <span>{user.email}</span>
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
                <span className="text-sm">{user.email}</span>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">First Name</label>
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{user.firstName}</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Last Name</label>
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{user.lastName}</span>
                </div>
              </div>
            </div>
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
              