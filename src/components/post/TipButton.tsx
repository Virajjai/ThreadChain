
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

interface TipButtonProps {
  postId: string;
  authorUsername: string;
  onTip: (postId: string, amount: number) => void;
  hasUserTipped?: boolean;
}

export const TipButton: React.FC<TipButtonProps> = ({ 
  postId, 
  authorUsername, 
  onTip, 
  hasUserTipped = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState('0.1');
  const [isLoading, setIsLoading] = useState(false);
  
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  const predefinedAmounts = [0.1, 0.5, 1, 2];

  const handleTip = async () => {
    if (!publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to send tips",
        variant: "destructive"
      });
      return;
    }

    const tipAmount = parseFloat(amount);
    if (isNaN(tipAmount) || tipAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid tip amount",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // For demo purposes, we'll simulate a successful transaction
      // In a real app, this would interact with your Solana program
      
      // Mock recipient public key (in real app, this would come from the post author's wallet)
      const recipientPubkey = new PublicKey('11111111111111111111111111111112');
      
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPubkey,
          lamports: tipAmount * LAMPORTS_PER_SOL,
        })
      );

      // For demo, we'll just simulate the transaction
      console.log(`Simulating tip of ${tipAmount} SOL to ${authorUsername}`);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Call the callback to update the UI
      onTip(postId, tipAmount);
      
      toast({
        title: "Tip sent successfully! 🎉",
        description: `You tipped ${tipAmount} SOL to @${authorUsername}`,
      });
      
      setIsOpen(false);
      setAmount('0.1');
      
    } catch (error) {
      console.error('Tip failed:', error);
      toast({
        title: "Tip failed",
        description: "There was an error sending your tip. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant={hasUserTipped ? "secondary" : "outline"}
            size="sm"
            className={`solana-gradient text-white border-0 hover:opacity-80 ${
              hasUserTipped ? 'opacity-60' : ''
            }`}
          >
            💰 Tip
          </Button>
        </motion.div>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md glass">
        <DialogHeader>
          <DialogTitle className="text-center text-gradient">
            Tip @{authorUsername}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 p-4">
          {/* Predefined amounts */}
          <div>
            <Label className="text-sm font-medium text-muted-foreground">
              Quick amounts
            </Label>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {predefinedAmounts.map((preset) => (
                <motion.button
                  key={preset}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setAmount(preset.toString())}
                  className={`p-3 rounded-lg border text-center font-medium transition-all ${
                    amount === preset.toString()
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card hover:bg-accent border-border'
                  }`}
                >
                  {preset} SOL
                </motion.button>
              ))}
            </div>
          </div>

          {/* Custom amount */}
          <div>
            <Label htmlFor="custom-amount" className="text-sm font-medium text-muted-foreground">
              Custom amount (SOL)
            </Label>
            <Input
              id="custom-amount"
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-2"
              placeholder="0.1"
            />
          </div>

          {/* USD equivalent (mock) */}
          <div className="text-center text-sm text-muted-foreground">
            ≈ ${(parseFloat(amount || '0') * 100).toFixed(2)} USD
          </div>

          {/* Send button */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleTip}
              disabled={isLoading || !publicKey}
              className="w-full solana-gradient text-white border-0 hover:opacity-80"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Sending...</span>
                </div>
              ) : (
                `Send ${amount} SOL`
              )}
            </Button>
          </motion.div>

          {!publicKey && (
            <p className="text-center text-sm text-muted-foreground">
              Connect your wallet to send tips
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
