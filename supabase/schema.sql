-- Create profiles table
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text
);

-- Create scripts table
create table public.scripts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  platform text not null,
  tone text not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.scripts enable row level security;

-- Profiles Policies
create policy "Users can view own profile" 
  on profiles for select 
  using (auth.uid() = id);

create policy "Users can insert own profile" 
  on profiles for insert 
  using (auth.uid() = id); -- Trigger usually handles this, but allowing insert is fine

-- Scripts Policies
create policy "Users can view own scripts" 
  on scripts for select 
  using (auth.uid() = user_id);

create policy "Users can insert own scripts" 
  on scripts for insert 
  with check (auth.uid() = user_id);

create policy "Users can delete own scripts" 
  on scripts for delete 
  using (auth.uid() = user_id);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
