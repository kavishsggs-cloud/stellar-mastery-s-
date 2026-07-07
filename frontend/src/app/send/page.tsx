"use client";

import { useWalletStore } from "@/store/walletStore";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Send, Loader2, Info } from "lucide-react";
import { motion } from "framer-motion";

import { sendPaymentAndReceipt } from "@/lib/contract";

export default function SendPayment() {
  const { isConnected, address, balance } = useWalletStore();
  const [isSending, setIsSending] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !address) {
      toast.error("Please connect your wallet first.");
      return;
    }
    if (!recipient || !amount) {
      toast.error("Recipient and Amount are required.");
      return;
    }
    if (parseFloat(amount) > parseFloat(balance)) {
      toast.error("Insufficient balance.");
      return;
    }

    try {
      setIsSending(true);
      toast.info("Building transaction...", { id: "tx-status" });
      
      const txHash = await sendPaymentAndReceipt(
        address,
        recipient,
        amount,
        memo || "No memo"
      );
      
      toast.success(
        <div className="flex flex-col gap-1">
          <span>Payment sent and receipt stored!</span>
          <a href={`https://stellar.expert/explorer/testnet/tx/${txHash}`} target="_blank" rel="noreferrer" className="text-xs underline text-blue-500">
            View on Stellar Expert
          </a>
        </div>, 
        { id: "tx-status" }
      );
      
      setRecipient("");
      setAmount("");
      setMemo("");
    } catch (error: unknown) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Transaction failed: ${errorMessage}`, { id: "tx-status" });
    } finally {
      setIsSending(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-xl text-muted-foreground">Please connect your wallet to send payments.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Send Payment</h1>
        <p className="text-muted-foreground mt-2">Transfer XLM on the Stellar Testnet securely.</p>
      </div>

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4 }}>
        <Card>
          <form onSubmit={handleSend}>
            <CardHeader>
              <CardTitle>Transfer Details</CardTitle>
              <CardDescription>Enter the recipient address and amount to send.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recipient">Recipient Public Key</Label>
                <Input 
                  id="recipient" 
                  placeholder="G..." 
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="font-mono text-sm"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (XLM)</Label>
                <div className="relative">
                  <Input 
                    id="amount" 
                    type="number" 
                    step="0.0000001" 
                    min="0"
                    placeholder="0.00" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
                    XLM
                  </div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Available: {parseFloat(balance).toFixed(2)} XLM</span>
                  <span className="flex items-center gap-1"><Info className="h-3 w-3" /> Fee: 0.00001 XLM</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="memo">Memo (Optional)</Label>
                <Input 
                  id="memo" 
                  placeholder="Payment description" 
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  maxLength={28}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isSending}>
                {isSending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Payment
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
