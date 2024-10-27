"use client"

import React, { useState, useEffect } from 'react';
import { Package, Box, Timer, Trophy, Plane, Globe } from 'lucide-react';

const WarehouseGame = () => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameActive, setGameActive] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [warehouseGrid, setWarehouseGrid] = useState([]);
  const targetScore = 500;
  
  // Generate random storage locations
  const generateWarehouseGrid = () => {
    const items = [
      { name: 'Domestic', icon: <Package className="w-4 h-4" /> },
      { name: 'International', icon: <Plane className="w-4 h-4" /> },
      { name: 'Global', icon: <Globe className="w-4 h-4" /> },
      { name: 'Express', icon: <Box className="w-4 h-4" /> }
    ];
    const colors = {
      'Domestic': 'bg-[#33B1FF] hover:bg-[#2090DD]',
      'International': 'bg-[#2090DD] hover:bg-[#1070BB]',
      'Global': 'bg-[#1070BB] hover:bg-[#005099]',
      'Express': 'bg-[#005099] hover:bg-[#004077]'
    };
    
    const grid = [];
    
    for (let i = 0; i < 16; i++) {
      const randomIndex = Math.floor(Math.random() * items.length);
      grid.push({
        id: i,
        item: items[randomIndex].name,
        icon: items[randomIndex].icon,
        color: colors[items[randomIndex].name],
        isActive: false
      });
    }
    return grid;
  };

  // Generate a new picking order
  const generateOrder = () => {
    const items = ['Domestic', 'International', 'Global', 'Express'];
    return {
      item: items[Math.floor(Math.random() * items.length)],
      quantity: Math.floor(Math.random() * 3) + 1,
      collected: 0
    };
  };

  // Rest of game logic remains the same
  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setGameActive(true);
    setWarehouseGrid(generateWarehouseGrid());
    setCurrentOrder(generateOrder());
  };

  const handleCellClick = (cell) => {
    if (!gameActive || !currentOrder) return;

    if (cell.item === currentOrder.item) {
      setScore(prev => prev + 10);
      const newOrder = { ...currentOrder };
      newOrder.collected++;

      if (newOrder.collected >= newOrder.quantity) {
        setCurrentOrder(generateOrder());
      } else {
        setCurrentOrder(newOrder);
      }
    } else {
      setScore(prev => Math.max(0, prev - 5));
    }
  };

  useEffect(() => {
    let timer;
    if (gameActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setGameActive(false);
    }
    return () => clearInterval(timer);
  }, [gameActive, timeLeft]);

  return (
    <div className="max-w-2xl mx-auto bg-gradient-to-b from-[#0A1520] to-[#0f2132] rounded-xl shadow-2xl p-8">
      {/* Logo and Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center gap-8 mb-4">
          <Package className="w-8 h-8 text-[#33B1FF]" />
          <Plane className="w-8 h-8 text-[#33B1FF]" />
          <Globe className="w-8 h-8 text-[#33B1FF]" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">
          <span className="text-[#33B1FF]">Quetico</span> Pick & Pack
        </h1>
        <p className="text-[#33B1FF]/80 text-lg">Can you beat {targetScore} points in 60 seconds?</p>
      </div>

      {/* Game Stats */}
      <div className="flex justify-between mb-6 bg-[#0A1520]/50 p-4 rounded-lg border border-[#33B1FF]/20">
        <div className="flex items-center">
          <Trophy className="w-6 h-6 mr-2 text-[#33B1FF]" />
          <span className="text-xl text-white">{score}</span>
        </div>
        <div className="flex items-center">
          <Timer className="w-6 h-6 mr-2 text-[#33B1FF]" />
          <span className="text-xl text-white">{timeLeft}s</span>
        </div>
      </div>

      {/* Start Button */}
      {!gameActive && (
        <button
          onClick={startGame}
          className="w-full p-4 mb-6 text-white bg-[#33B1FF] rounded-lg hover:bg-[#2090DD] 
            transition-all duration-300 transform hover:scale-105 font-bold shadow-lg 
            hover:shadow-[#33B1FF]/20"
        >
          Start Game
        </button>
      )}

      {/* Current Order */}
      {gameActive && currentOrder && (
        <div className="mb-6 p-4 bg-[#0A1520]/50 rounded-lg border border-[#33B1FF]/20">
          <div className="text-lg font-semibold text-[#33B1FF] mb-2">Current Order</div>
          <div className="flex items-center text-white">
            <Box className="w-5 h-5 mr-2 text-[#33B1FF]" />
            <span>Pick {currentOrder.quantity - currentOrder.collected} {currentOrder.item}</span>
          </div>
        </div>
      )}

      {/* Game Grid */}
      <div className="grid grid-cols-4 gap-3">
        {warehouseGrid.map((cell) => (
          <button
            key={cell.id}
            onClick={() => handleCellClick(cell)}
            className={`${cell.color} p-4 rounded-lg text-white font-bold h-24 
              flex flex-col items-center justify-center gap-2 transform hover:scale-105 
              transition-all duration-300 ${!gameActive ? 'opacity-50 cursor-not-allowed' : ''}
              shadow-lg hover:shadow-xl`}
            disabled={!gameActive}
          >
            {cell.icon}
            <span className="text-sm">{cell.item}</span>
          </button>
        ))}
      </div>

      {/* Game Over */}
      {!gameActive && score > 0 && (
        <div className="mt-6 p-6 bg-[#0A1520]/50 rounded-lg text-center border border-[#33B1FF]/20">
          <div className="text-2xl font-bold text-[#33B1FF] mb-2">Game Over!</div>
          <div className="text-white text-lg mb-4">Final Score: {score}</div>
          {score >= targetScore ? (
            <div className="text-[#33B1FF] font-semibold">Congratulations! You beat the challenge! 🏆</div>
          ) : (
            <div className="text-[#33B1FF] font-semibold">Try again to beat {targetScore} points!</div>
          )}
        </div>
      )}
    </div>
  );
};

export default WarehouseGame;
