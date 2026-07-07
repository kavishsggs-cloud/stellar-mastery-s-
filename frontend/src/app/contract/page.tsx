"use client";

import { useWalletStore } from "@/store/walletStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Server, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ContractPage() {
  const { isConnected, network } = useWalletStore();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Smart Contract</h1>
        <p className="text-muted-foreground mt-2">View real-time contract state and data on Soroban.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3 }}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Server className="h-5 w-5"/> Network details</CardTitle>
              <CardDescription>Current network configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-md bg-muted/50">
                <span className="text-sm text-muted-foreground">Network</span>
                <span className="font-mono font-medium">{network}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-md bg-muted/50">
                <span className="text-sm text-muted-foreground">RPC URL</span>
                <span className="font-mono font-medium text-xs">https://soroban-testnet.stellar.org</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-md bg-muted/50">
                <span className="text-sm text-muted-foreground">Passphrase</span>
                <span className="font-mono font-medium text-xs truncate max-w-[150px]">Test SDF Network ; September 2015</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4 }}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Code className="h-5 w-5"/> Contract details</CardTitle>
              <CardDescription>PaymentReceiptContract instance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-md bg-muted/50">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className="font-medium flex items-center text-green-500"><CheckCircle2 className="h-4 w-4 mr-1"/> Deployed</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-md bg-muted/50">
                <span className="text-sm text-muted-foreground">Contract ID</span>
                <span className="font-mono font-medium text-xs text-primary">C... (Pending Deploy)</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-md bg-muted/50">
                <span className="text-sm text-muted-foreground">Total Receipts</span>
                <span className="font-mono font-medium">3</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Raw Contract State</CardTitle>
          <CardDescription>Latest events and storage read directly from the RPC.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-black/90 text-green-400 p-4 rounded-md font-mono text-sm overflow-x-auto">
            {isConnected ? (
              <pre>
{`[
  {
    "type": "event",
    "topics": ["ReceiptCreated", "1"],
    "data": {
      "sender": "GBX7...",
      "amount": "100.5",
      "status": "Pending"
    }
  },
  ...
]`}
              </pre>
            ) : (
              <p className="text-muted-foreground">Connect wallet to view contract state.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
