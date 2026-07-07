"use client";

import Link from "next/link";
import { LayoutDashboard, Send, History, Settings, Code, Zap } from "lucide-react";
import { useWalletStore } from "@/store/walletStore";
import { Button } from "@/components/ui/button";
import { useStellar } from "@/hooks/useStellar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function Sidebar() {
  const { address, isConnected, disconnect } = useWalletStore();
  const { connectWallet, isConnecting } = useStellar();

  const truncateAddress = (addr: string) => 
    `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;

  return (
    <div className="w-64 h-screen border-r bg-card flex flex-col justify-between">
      <div>
        <div className="p-6">
          <div className="flex items-center gap-2 font-bold text-2xl text-primary">
            <Zap className="h-6 w-6" />
            <span>StellarPay</span>
          </div>
        </div>

        <nav className="px-4 space-y-2 mt-4">
          <Link href="/" className="flex items-center gap-3 px-3 py-2 text-muted-foreground rounded-lg hover:bg-accent hover:text-foreground transition-all">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link href="/send" className="flex items-center gap-3 px-3 py-2 text-muted-foreground rounded-lg hover:bg-accent hover:text-foreground transition-all">
            <Send className="h-4 w-4" />
            Send Payment
          </Link>
          <Link href="/history" className="flex items-center gap-3 px-3 py-2 text-muted-foreground rounded-lg hover:bg-accent hover:text-foreground transition-all">
            <History className="h-4 w-4" />
            History
          </Link>
          <Link href="/contract" className="flex items-center gap-3 px-3 py-2 text-muted-foreground rounded-lg hover:bg-accent hover:text-foreground transition-all">
            <Code className="h-4 w-4" />
            Smart Contract
          </Link>
          <Link href="/settings" className="flex items-center gap-3 px-3 py-2 text-muted-foreground rounded-lg hover:bg-accent hover:text-foreground transition-all">
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </nav>
      </div>

      <div className="p-4">
        {isConnected && address ? (
          <Card className="shadow-none border-border">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium">Connected</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-xs text-muted-foreground truncate mb-4">
                {truncateAddress(address)}
              </p>
              <Button onClick={disconnect} variant="outline" className="w-full text-xs h-8">
                Disconnect
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Button 
            onClick={connectWallet} 
            disabled={isConnecting}
            className="w-full"
          >
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </Button>
        )}
      </div>
    </div>
  );
}
