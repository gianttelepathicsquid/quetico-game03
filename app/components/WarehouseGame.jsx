"use client"

import React, { useState, useEffect } from 'react';
import { Package, Box, Timer, Trophy, Plane, Globe } from 'lucide-react';

const GridItem = ({ item, icon, onClick, disabled, isActive }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      p-4 rounded-lg font-bold h-24 
      flex flex-col items-center justify-center gap-2 
      transform transition-all duration-300
      ${isActive ? 'scale-105' : 'hover:scale-105'}
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      ${item === 'Domestic' ? 'bg-[#33B1FF] hover:bg-[#2090DD]' : ''}
      ${item === 'International' ? 'bg-[#2090DD] hover:bg-[#1070BB]' : ''}
      ${item === 'Global' ? 'bg-[#1070BB] hover:bg-[#005099]' : ''}
      ${item === 'Express' ? 'bg-[#005099] hover:bg-[#004077]' : ''}
      shadow-lg hover:shadow-xl text-white
    `}
  >
    <div className="text-white w-6 h-6">{icon}</div>
    <span className="text-sm">{item}</span>
  </button>
);

const WarehouseGame = () => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameActive, setGameActive] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [warehouseGrid, setWarehouseGrid] = useState([]);

  const generateWarehouseGrid = () => {
    const items = [
      { name: 'Domestic', icon: <Package /> },
      { name: 'International', icon: <Plane /> },
      { name: 'Global', icon: <Globe /> },
      { name: 'Express', icon: <Box /> }
    ];
    
    return Array(16).fill(null).map((_, i) => {
      const randomItem = items[Math.floor(Math.random() * items.length)];
      return {
        id: i,
        item: randomItem.name,
        icon: randomItem.icon
      };
    });
  };

  const generateOrder = () => {
    const items = ['Domestic', 'International', 'Global', 'Express'];
    return {
      item: items[Math.floor(Math.random() * items.length)],
      quantity: Math.floor(Math.random() * 3) + 1,
      collected: 0
    };
  };

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
    <div className="max-w-2xl mx-auto bg-quetico-navy rounded-xl shadow-2xl p-8">
      {/* Logo Header */}
      <div className="flex justify-center gap-6 mb-6">
        <Package className="w-8 h-8 text-quetico-blue animate-float" />
        <Plane className="w-8 h-8 text-quetico-blue animate-float" style={{ animationDelay: '0.2s' }} />
        <Globe className="w-8 h-8 text-quetico-blue animate-float" style={{ animationDelay: '0.4s' }} />
      </div>

      {/* Game Title */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          <span className="text-quetico-blue">Quetico</span> Pick & Pack
        </h1>
        <p className="text-quetico-blue/80 text-lg">Can you beat 500 points in 60 seconds?</p>
      </div>

      {/* Game Stats */}
      <div className="flex justify-between mb-6 bg-black/20 p-4 rounded-lg border border-quetico-blue/20">
        <div className="flex items-center">
          <Trophy className="w-6 h-6 mr-2 text-quetico-blue" />
          <span className="text-xl text-white">{score}</span>
        </div>
        <div className="flex items-center">
          <Timer className="w-6 h-6 mr-2 text-quetico-blue" />
          <span className="text-xl text-white">{timeLeft}s</span>
        </div>
      </div>

      {/* Start Button */}
      {!gameActive && (
        <button
          onClick={startGame}
          className="w-full p-4 mb-6 text-white bg-quetico-blue rounded-lg 
            hover:bg-quetico-blue/80 transition-all duration-300 
            transform hover:scale-105 font-bold shadow-lg hover:shadow-quetico-blue/20"
        >
          Start Game
        </button>
      )}

      {/* Current Order */}
      {gameActive && currentOrder && (
        <div className="mb-6 p-4 bg-black/20 rounded-lg border border-quetico-blue/20">
          <div className="text-lg font-semibold text-quetico-blue mb-2">Current Order</div>
          <div className="flex items-center text-white">
            <Box className="w-5 h-5 mr-2 text-quetico-blue" />
            <span>Pick {currentOrder.quantity - currentOrder.collected} {currentOrder.item}</span>
          </div>
        </div>
      )}

      {/* Game Grid */}
      <div className="grid grid-cols-4 gap-3">
        {warehouseGrid.map((cell) => (
          <GridItem
            key={cell.id}
            item={cell.item}
            icon={cell.icon}
            onClick={() => handleCellClick(cell)}
            disabled={!gameActive}
            isActive={gameActive && currentOrder?.item === cell.item}
          />
        ))}
      </div>

      {/* Game Over Screen */}
      {!gameActive && score > 0 && (
        <div className="mt-6 p-6 bg-black/20 rounded-lg text-center border border-quetico-blue/20">
          <div className="text-2xl font-bold text-quetico-blue mb-2">Game Over!</div>
          <div className="text-white text-lg mb-4">Final Score: {score}</div>
          {score >= 500 ? (
            <div className="text-quetico-blue font-semibold">
              Congratulations! You beat the challenge! 🏆
            </div>
          ) : (
            <div className="text-quetico-blue font-semibold">
              Try again to beat 500 points!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WarehouseGame;
