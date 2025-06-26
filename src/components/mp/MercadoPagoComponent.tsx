import { Wallet } from "@mercadopago/sdk-react";

interface MercadoPagoButtonProps {
  preferenceId: string;
}

const MercadoPagoButton: React.FC<MercadoPagoButtonProps> = ({ preferenceId }) => {
  if (!preferenceId) return null;
  return (
    <div style={{ marginTop: 20 }}>
      <Wallet initialization={{ preferenceId }} />
    </div>
  );
};

export default MercadoPagoButton;