"use client";

import { useWalletStore } from "@/store/walletStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ExternalLink, CheckCircle2, Clock, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { listReceipts } from "@/lib/contract";

export default function HistoryPage() {
  const { isConnected, address } = useWalletStore();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [receipts, setReceipts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      if (isConnected && address) {
        setIsLoading(true);
        try {
          const fetchedReceipts = await listReceipts(address);
          setReceipts(fetchedReceipts || []);
        } catch (e) {
          console.error("Failed to load history:", e);
        } finally {
          setIsLoading(false);
        }
      }
    }
    fetchHistory();
  }, [isConnected, address]);

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-xl text-muted-foreground">Please connect your wallet to view history.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary opacity-50" />
        <p className="text-muted-foreground">Loading receipts from Soroban...</p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Confirmed":
        return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20"><CheckCircle2 className="w-3 h-3 mr-1"/> Confirmed</Badge>;
      case "Pending":
        return <Badge className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20"><Clock className="w-3 h-3 mr-1"/> Pending</Badge>;
      case "Failed":
        return <Badge variant="destructive" className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20"><XCircle className="w-3 h-3 mr-1"/> Failed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payment History</h1>
        <p className="text-muted-foreground mt-2">View your past transactions stored on the Soroban smart contract.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your latest payment receipts and their status.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-6 p-4 text-sm font-medium text-muted-foreground border-b">
              <div>Recipient</div>
              <div>Amount</div>
              <div className="hidden md:block">Memo</div>
              <div className="hidden md:block">Time</div>
              <div>Status</div>
              <div className="text-right">Explorer</div>
            </div>
            
            <div className="divide-y">
              {receipts.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">No transactions found.</div>
              ) : (
                receipts.map((receipt, index) => {
                  // Map ScVal properties if they exist, otherwise use direct
                  const txHash = receipt.tx_hash || receipt.txHash;
                  const recipient = receipt.receiver || receipt.recipient;
                  const amount = receipt.amount ? (Number(receipt.amount) / 10000000).toFixed(2) : "0.00"; // Assuming native formatting
                  
                  return (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    key={receipt.id} 
                    className="grid grid-cols-6 p-4 text-sm items-center hover:bg-muted/50 transition-colors"
                  >
                    <div className="font-mono">{recipient?.toString().substring(0, 4)}...{recipient?.toString().substring(52)}</div>
                    <div className="font-bold">{amount} XLM</div>
                    <div className="hidden md:block text-muted-foreground">{receipt.memo || "-"}</div>
                    <div suppressHydrationWarning className="hidden md:block text-muted-foreground">{new Date(Number(receipt.timestamp) * 1000).toLocaleString()}</div>
                    <div>{getStatusBadge(receipt.status?.toString() || "Pending")}</div>
                    <div className="text-right">
                      <Link 
                        href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center p-2 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </div>
                  </motion.div>
                )})
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
