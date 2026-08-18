import { InputAdornment, TextField, type TextFieldProps } from '@mui/material'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'

type SearchBarProps = Omit<TextFieldProps, 'onChange'> & {
  onValueChange?: (value: string) => void
}

export function SearchBar({ onValueChange, placeholder = 'Search…', ...rest }: SearchBarProps) {
  return (
    <TextField
      fullWidth
      placeholder={placeholder}
      onChange={(e) => onValueChange?.(e.target.value)}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchRoundedIcon fontSize="small" color="disabled" />
            </InputAdornment>
          ),
        },
      }}
      {...rest}
    />
  )
}
