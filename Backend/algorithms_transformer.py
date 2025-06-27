import torch
import torch.nn as nn
import pandas as pd
from torch.utils.data import Dataset, DataLoader

class ShadowDataset(Dataset):
    def __init__(self, data_path):
        df = pd.read_csv(data_path)
        self.X = torch.tensor(df.drop(['date', 'symbol', 'shadow_price'], axis=1).values, dtype=torch.float32)
        self.y = torch.tensor(df['shadow_price'].values, dtype=torch.float32)

    def __len__(self):
        return len(self.y)

    def __getitem__(self, idx):
        return self.X[idx], self.y[idx]

class TransformerModel(nn.Module):
    def __init__(self, input_dim, d_model=64, nhead=4, num_layers=2):
        super().__init__()
        self.encoder = nn.TransformerEncoder(
            nn.TransformerEncoderLayer(d_model=d_model, nhead=nhead),
            num_layers=num_layers
        )
        self.linear = nn.Linear(d_model, 1)

    def forward(self, src):
        # src: (seq_len, batch, input_dim)
        src = src.unsqueeze(0)  # Add sequence dimension
        output = self.encoder(src)
        output = self.linear(output[-1])
        return output

# Usage example:
# dataset = ShadowDataset('data/feature_matrix.csv')
# loader = DataLoader(dataset, batch_size=32)
# model = TransformerModel(input_dim=dataset.X.shape[1])
