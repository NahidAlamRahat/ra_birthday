// lib/constants/colors.dart
// App-wide luxury color palette

import 'package:flutter/material.dart';

class AppColors {
  // Luxury gradient stops
  static const Color deepPurple = Color(0xFF1A0533);
  static const Color midPurple = Color(0xFF3D1160);
  static const Color rose = Color(0xFF8B1A5C);
  static const Color hotPink = Color(0xFFD4478A);
  static const Color softPink = Color(0xFFFFB3D1);
  static const Color roseGold = Color(0xFFB76E79);
  static const Color gold = Color(0xFFFFD700);
  static const Color white = Color(0xFFFFFFFF);
  static const Color softWhite = Color(0xFFF8F0FF);
  static const Color glassWhite = Color(0x1AFFFFFF);
  static const Color glassBorder = Color(0x33FFFFFF);

  // Gradients
  static const LinearGradient bgGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [
      Color(0xFF0D0015),
      Color(0xFF2E0050),
      Color(0xFF6B1060),
      Color(0xFF9C2463),
      Color(0xFF2E0050),
      Color(0xFF0D0015),
    ],
    stops: [0.0, 0.2, 0.4, 0.6, 0.8, 1.0],
  );

  static const LinearGradient cardGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [
      Color(0x22FFFFFF),
      Color(0x11FF69B4),
    ],
  );

  static const LinearGradient heartGradient = LinearGradient(
    colors: [Color(0xFFFF1493), Color(0xFFFF69B4)],
  );

  static const LinearGradient textGradient = LinearGradient(
    colors: [Color(0xFFFFB3D1), Color(0xFFFF69B4), Color(0xFFFFD700)],
  );
}
