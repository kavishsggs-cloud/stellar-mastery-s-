"use client";

import { useWalletStore } from "@/store/walletStore";
import { useStellar } from "@/hooks/useStellar";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, ArrowUpRight, Activity, Zap, History, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getContractEvents, listReceipts } from "@/lib/contract";

export default function Dashboard() {
  const { address, isConnected, balance, network } = useWalletStore();
  const { refreshBalance } = useStellar();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [events, setEvents] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [receipts, setReceipts] = useState<any[]>([]);

  useEffect(() => {
    if (isConnected && address) {
      refreshBalance();
      
      const fetchData = async () => {
        try {
          const fetchedReceipts = await listReceipts(address);
          setReceipts(fetchedReceipts || []);
          
          const fetchedEvents = await getContractEvents();
          setEvents(fetchedEvents || []);
        } catch (e) {
          console.error(e);
        }
      };
      
      fetchData();

      // Poll every 5s for demo purposes
      const interval = setInterval(() => {
        refreshBalance();
        fetchData();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isConnected, address, refreshBalance]);

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] space-y-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="p-8 rounded-full bg-primary/10 text-primary backdrop-blur-md"
        >
          <Wallet className="h-16 w-16" />
        </motion.div>
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">Welcome to StellarPay</h1>
          <p className="text-muted-foreground mt-1">Connect your wallet to start using StellarPay.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome back! Here&apos;s your overview on {network}.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <Card className="bg-background/60 backdrop-blur-lg border-primary/10 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{parseFloat(balance).toFixed(2)} XLM</div>
              <p className="text-xs text-muted-foreground mt-1">Available on {network}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          <Card className="bg-background/60 backdrop-blur-lg border-primary/10 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Recent Payments</CardTitle>
              <History className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{receipts.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Stored on Soroban</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          <Card className="bg-background/60 backdrop-blur-lg border-primary/10 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Contract Status</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">Active</div>
              <p className="text-xs text-muted-foreground mt-1">PaymentReceiptContract</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
          <Card className="bg-background/60 backdrop-blur-lg border-primary/10 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Network Status</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">Connected</div>
              <p className="text-xs text-muted-foreground mt-1">Testnet Horizon</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.5 }}>
          <Card className="col-span-1 h-full bg-background/60 backdrop-blur-lg border-primary/10">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks you can perform</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Link href="/send" className="w-full">
                <Button className="w-full h-12 text-md gap-2 shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-primary to-blue-600"><ArrowUpRight className="h-5 w-5" /> Send Payment</Button>
              </Link>
              <Link href="/history" className="w-full">
                <Button variant="secondary" className="w-full h-12 text-md gap-2"><History className="h-5 w-5" /> View History</Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.6 }}>
          <Card className="col-span-1 h-full bg-background/60 backdrop-blur-lg border-primary/10">
            <CardHeader>
              <CardTitle>Latest Events</CardTitle>
              <CardDescription>Real-time updates from the smart contract</CardDescription>
            </CardHeader>
            <CardContent>
              {events.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin mb-4 opacity-50" />
                  <p className="text-sm">Listening for contract events...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {events.slice(0, 3).map((event, idx) => (
                      <motion.div
                        key={event.id || idx}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50 border border-secondary"
                      >
                        <div className="p-2 rounded-full bg-primary/20 text-primary">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="text-sm font-medium truncate">
                            Event: {event.type}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            Ledger: {event.ledger}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
