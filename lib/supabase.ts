import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our sales form data
export interface SalesFormData {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role: string;
  decision_maker: string;
  pharmacy_name: string;
  pharmacy_address?: string;
  pharmacy_city?: string;
  pharmacy_state?: string;
  pharmacy_zip?: string;
  pharmacy_size?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

// Function to submit sales form data
export const submitSalesForm = async (
  formData: Omit<SalesFormData, "id" | "created_at" | "updated_at">,
) => {
  const { data, error } = await supabase
    .from("sales_signups")
    .insert([
      {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        decision_maker: formData.decision_maker,
        pharmacy_name: formData.pharmacy_name,
        pharmacy_address: formData.pharmacy_address,
        pharmacy_city: formData.pharmacy_city,
        pharmacy_state: formData.pharmacy_state,
        pharmacy_zip: formData.pharmacy_zip,
        pharmacy_size: formData.pharmacy_size,
        notes: formData.notes,
      },
    ])
    .select();

  if (error) {
    console.error("Error submitting sales form:", error);
    throw error;
  }

  return data;
};
