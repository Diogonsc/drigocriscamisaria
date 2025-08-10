import { DressFormIcon } from "@/components/ui/dress-form-icon";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t bg-gradient-to-r from-[#9bae92] via-[#b8c5b0] to-[#d4ddd0] py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          {/* Logo e nome da loja */}
          <div className="flex items-center gap-2">
            <DressFormIcon className="h-8 w-8 text-white" />
            <span className="text-lg font-semibold text-white">DrigoCris Camisaria</span>
          </div>
          
          {/* Direitos reservados */}
          <div className="text-sm text-white/90">
            <p>&copy; {currentYear} Todos os direitos reservados</p>
            <p className="mt-1">Desenvolvido por <span className="font-semibold">Diogo Nascimento</span></p>
          </div>
        </div>
      </div>
    </footer>
  );
};
