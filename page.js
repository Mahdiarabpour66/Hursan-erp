"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase, getCurrentAppUser } from "../../lib/supabase";

export default function UsersPage() {
  const router = useRouter();
  const [me, setMe] = useState(null);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data: usersData, error: uErr } = await supabase
      .from("User")
      .select("id, fullName, email, isActive, roleId, Role(name, label)")
      .order("createdAt", { ascending: true });
    if (uErr) setMessage("خطا در دریافت کاربران: " + uErr.message);
    setUsers(usersData || []);

    const { data: rolesData } = await supabase.from("Role").select("id, name, label");
    setRoles(rolesData || []);
  }, []);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace("/login");
        return;
      }
      const appUser = await getCurrentAppUser();
      setMe(appUser);
      if (appUser?.Role?.name === "ADMIN" || appUser?.Role?.name === "MANAGER") {
        await load();
      }
      setLoading(false);
    })();
  }, [router, load]);

  async function changeRole(userId, roleId) {
    setMessage("");
    const { error } = await supabase.from("User").update({ roleId }).eq("id", userId);
    setMessage(error ? "خطا: " + error.message : "نقش به‌روزرسانی شد.");
    await load();
  }

  async function toggleActive(u) {
    setMessage("");
    const { error } = await supabase
      .from("User")
      .update({ isActive: !u.isActive })
      .eq("id", u.id);
    setMessage(error ? "خطا: " + error.message : "وضعیت کاربر تغییر کرد.");
    await load();
  }

  async function logout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  if (loading) return <div className="wrap muted">در حال بارگذاری...</div>;

  const isAdmin = me?.Role?.name === "ADMIN";
  const canView = me?.isActive && (isAdmin || me?.Role?.name === "MANAGER");

  if (!canView) {
    return (
      <div className="wrap">
        <div className="card">
          <p className="error">شما دسترسی به این بخش ندارید.</p>
          <button className="ghost" onClick={logout}>خروج</button>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap">
      <div className="card">
        <div className="row" style={{ justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            <h2 style={{ margin: 0 }}>مدیریت کاربران</h2>
            <div className="muted">وارد شده به عنوان: {me.fullName} ({me.Role?.label})</div>
          </div>
          <button className="ghost" onClick={logout}>خروج</button>
        </div>

        {!isAdmin && <p className="muted">فقط مدیر کل میتونه نقش‌ها رو تغییر بده.</p>}
        {message && <p>{message}</p>}

        <table>
          <thead>
            <tr>
              <th>نام</th>
              <th>ایمیل</th>
              <th>نقش</th>
              <th>وضعیت</th>
              {isAdmin && <th>عملیات</th>}
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.fullName}</td>
                <td dir="ltr">{u.email}</td>
                <td>
                  {isAdmin ? (
                    <select value={u.roleId} onChange={(e) => changeRole(u.id, e.target.value)}>
                      {roles.map((r) => (
                        <option key={r.id} value={r.id}>{r.label}</option>
                      ))}
                    </select>
                  ) : (
                    u.Role?.label
                  )}
                </td>
                <td>{u.isActive ? "فعال" : "غیرفعال"}</td>
                {isAdmin && (
                  <td>
                    <button className="ghost" onClick={() => toggleActive(u)}>
                      {u.isActive ? "غیرفعال کردن" : "فعال کردن"}
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        <p className="muted" style={{ marginTop: 16 }}>
          برای افزودن کاربر جدید: در داشبورد Supabase از Authentication &gt; Users کاربر بساز (با Auto Confirm). بعد از ساخته شدن، خودکار در این لیست ظاهر میشه و اینجا نقشش رو تعیین کن.
        </p>
      </div>
    </div>
  );
}
