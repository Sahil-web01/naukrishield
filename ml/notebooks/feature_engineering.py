
import pandas as pd
import numpy as np

# PASTE THE EXACT add_engineered_features()
# FUNCTION FROM YOUR EARLIER NOTEBOOK CELL HERE.

def add_engineered_features(df):
    df = df.copy()

    # Text-length features

    text_cols = [
        "title",
        "company_profile",
        "description",
        "requirements",
        "benefits"
    ]

    for col in text_cols:
        df[f"{col}_word_count"] = (
            df[col]
            .fillna("")
            .astype(str)
            .str.split()
            .str.len()
        )

    # Combined text word count
    df["total_word_count"] = (
        df["text"]
        .fillna("")
        .astype(str)
        .str.split()
        .str.len()
    )

    # Missingness indicators

    missing_cols = [
        "company_profile",
        "salary_range",
        "department",
        "required_education",
        "benefits",
        "required_experience",
        "function",
        "industry",
        "employment_type",
        "requirements",
        "location"
    ]

    for col in missing_cols:
        df[f"{col}_missing"] = (
            df[col].isna().astype(int)
        )

    return df
