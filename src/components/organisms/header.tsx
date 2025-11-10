"use client";
import React, { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { Button } from "../atoms/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../atoms/sheet";
import { ThemeToggle } from "./theme-toggle";

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Readme", href: "/readme" },
    { label: "Solutions", href: "#solutions" },
    { label: "Pricing", href: "#pricing" },
    { label: "Resources", href: "#resources" },
    { label: "About", href: "#about" },
  ];

  return (
    <header
      className={`z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-sm border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <span className="text-primary-foreground font-bold text-lg">
                  E
                </span>
              </div>
              <span className="text-xl font-semibold text-foreground">
                Emergent
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-accent/50 rounded-md transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
            <Button size="sm">Get Started</Button>
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="text-left">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-primary-foreground font-bold text-lg">
                          E
                        </span>
                      </div>
                      <span className="text-xl font-semibold">Emergent</span>
                    </div>
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-1 mt-8">
                  {navLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-4 py-3 text-base font-medium text-foreground hover:bg-accent/50 rounded-md transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  ))}
                  <div className="pt-4 space-y-2 border-t border-border mt-4">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </Button>
                    <Button
                      className="w-full"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Get Started
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};
